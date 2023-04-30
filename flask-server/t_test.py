# Importing library
import scipy.stats as stats
import csv

v0 = []
v1 = []
v2 = []
u0 = []
u1 = []
u2 = []
u3 = []

# opening the CSV file
with open('./result/twitter_results_org.csv', mode='r') as file:
    # reading the CSV file
    csvFile = csv.reader(file)
    next(csvFile)

    i = 0
    # displaying the contents of the CSV file
    for lines in csvFile:
        if i//10 == 0:
            v0.append(float(lines[5]))
        elif i//10 == 1:
            v1.append(float(lines[5]))
        elif i//10 == 2:
            v2.append(float(lines[5]))
        elif i//10 == 3:
            u0.append(float(lines[5]))
        elif i//10 == 4:
            u1.append(float(lines[5]))
        elif i//10 == 5:
            u2.append(float(lines[5]))
        else:
            u3.append(float(lines[5]))
        i = i + 1
print(v0)
print(v1)
print(v2)
print(u0)
print(u1)
print(u2)
print(u3)



differences = [a - b for a, b in zip(u0,v0)]
print(stats.ttest_1samp(differences, 0))


differences = [a - b for a, b in zip(u1,v0)]
print(stats.ttest_1samp(differences, 0))


differences = [a - b for a, b in zip(u2,v0)]
print(stats.ttest_1samp(differences, 0))


differences = [a - b for a, b in zip(u3,v0)]
print(stats.ttest_1samp(differences, 0))


# Performing the paired sample t-test
print("v0:")
print(stats.ttest_rel(u0,v0))
print(stats.ttest_rel(u1,v0))
print(stats.ttest_rel(u2,v0))
print(stats.ttest_rel(u3,v0))

print("v1:")
print(stats.ttest_rel(u0,v1))
print(stats.ttest_rel(u1,v1))
print(stats.ttest_rel(u2,v1))
print(stats.ttest_rel(u3,v1))

print("v2:")
print(stats.ttest_rel(u0,v2))
print(stats.ttest_rel(u1,v2))
print(stats.ttest_rel(u2,v2))
print(stats.ttest_rel(u3,v2))


print(stats.ttest_rel(v1,v0))
print(stats.ttest_rel(v2,v0))
print(stats.ttest_rel(v2,v1))


